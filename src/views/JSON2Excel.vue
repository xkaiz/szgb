<template>
    <div id="app">
        <h1>JSON2Excel</h1>
        <input type="file" @change="handleFileUpload" accept=".txt" multiple />
        <button @click="convertToExcel">转换为Excel</button>
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
                alert('Please select some TXT files.');
                return;
            }

            const promises = Array.from(files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            if (!Array.isArray(data)) {
                                throw new Error('JSON data is not an array.');
                            }
                            resolve(data);
                        } catch (error) {
                            reject('Error reading JSON from file ' + file.name + ': ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                });
            });

            Promise.all(promises)
                .then(results => {
                    // 合并所有 JSON 数据
                    this.jsonData = results.flat();
                })
                .catch(error => {
                    alert(error);
                });
        },
        convertToExcel() {
            if (!this.jsonData.length) {
                alert('No JSON data available. Please upload files first.');
                return;
            }

            // 提取问题和正确答案
            const extractedData = this.jsonData.map(item => ({
                question: item.questionName,
                correctAnswer: item.enterExamQuestionOptionVOList.find(option => option.rightAnswer === 1)?.questionOptionValue || '无'
            }));

            // 转换为工作表
            const worksheet = XLSX.utils.json_to_sheet(extractedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

            // 生成 Excel 文件
            XLSX.writeFile(workbook, 'output.xlsx');
        }
    }
};
</script>

<style>
#app {
    text-align: center;
}

input {
    margin: 10px;
}
</style>