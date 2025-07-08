<template>
    <div id="app">
        <h1>JSON2Excel</h1>
        <input type="file" @change="handleFileUpload" accept=".txt" multiple />
        <el-button @click="convertToExcel">转换为Excel</el-button>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
    name: 'App',
    data() {
        return {
            jsonData: []
        };
    },
    methods: {
        handleFileUpload(event) {
            const files = event.target.files;
            if (!files.length) {
                alert('请上传一些 TXT 文件。');
                return;
            }

            const promises = Array.from(files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result).data.rows;
                            if (!Array.isArray(data)) {
                                throw new Error('JSON 数据不是一个数组。');
                            }
                            resolve(data);
                        } catch (error) {
                            reject('读取文件 ' + file.name + ' 的 JSON 时出错: ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                });
            });

            Promise.all(promises)
                .then(results => {
                    this.jsonData = results.flat();
                })
                .catch(error => {
                    alert(error);
                });
        },
        convertToExcel() {
            if (!this.jsonData.length) {
                alert('没有可用的 JSON 数据。请先上传文件。');
                return;
            }

            const extractedData = this.jsonData.map(item => {
                const options = item.enterExamQuestionOptionVOList.map((option, index) => {
                    return { label: String.fromCharCode(65 + index), value: option.questionOptionValue, isCorrect: option.rightAnswer === 1 };
                });

                // 判断是否为判断题
                const isTrueFalse = options.length === 2 && options.every(option =>
                    ["错误", "正确", "对", "错"].includes(option.value)
                );

                let correctAnswers;

                if (isTrueFalse) {
                    const correctOption = options.find(option => option.isCorrect);
                    correctAnswers = correctOption ? correctOption.label : '无';
                } else {
                    correctAnswers = options.filter(option => option.isCorrect).map(option => option.label).join('');
                }

                const optionValues = options.map(option => option.value);

                // 增加 questionAnalysis 数据
                const questionAnalysis = item.questionAnalysis || '无';

                return [item.questionName, correctAnswers || '无', questionAnalysis, ...optionValues];
            });

            const worksheet = XLSX.utils.aoa_to_sheet(extractedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

            XLSX.writeFile(workbook, 'output.xlsx');
        }
    }
};
</script>