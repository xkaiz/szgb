<template>
    <div id="app">
        <h1>JSON2Excel</h1>
        <input type="file" @change="handleFileUpload" accept=".txt" multiple />

        <label>
            <input type="radio" value="multipleChoice" v-model="questionType" />
            选项型
        </label>
        <label>
            <input type="radio" value="openEnded" v-model="questionType" />
            问答型
        </label>

        <el-button @click="convertToExcel">转换为Excel</el-button>
    </div>
</template>
<script>
import * as XLSX from 'xlsx';

export default {
    name: 'App',
    data() {
        return {
            jsonData: [],
            questionType: 'multipleChoice' // Default selection
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
                            const data = JSON.parse(e.target.result).data.rows;
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
                // Get correct answers with corresponding option labels
                const options = item.enterExamQuestionOptionVOList.map((option, index) => {
                    return { label: String.fromCharCode(65 + index), value: option.questionOptionValue, isCorrect: option.rightAnswer === 1 };
                });

                const correctAnswers = options.filter(option => option.isCorrect).map(option => option.label).join(''); // No separator

                if (this.questionType === 'multipleChoice') {
                    // Format for multiple choice
                    const optionValues = options.map(option => option.value).slice(0, 5); // Ensure only A-E
                    return [item.questionName, correctAnswers || '无', '', ...optionValues];
                } else {
                    // Format for open-ended: only include the answer
                    const answer = options.find(option => option.isCorrect)?.value || '无'; // Get the correct answer or '无'
                    return [item.questionName, answer];
                }
            });

            // Create worksheet with the extracted data
            const worksheet = XLSX.utils.aoa_to_sheet(extractedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

            // Generate Excel file
            XLSX.writeFile(workbook, 'output.xlsx');
        }
    }
};
</script>