<template>
    <div id="app">
        <h1>题目读取器</h1>
        <input type="file" @change="handleFileUpload" />
        <button @click="exportToExcel">导出为 Excel</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx'; // 导入 xlsx 库

const jsonArray = ref([]);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            processQuestions(content);
        };
        reader.readAsText(file);
    } else {
        alert("请上传一个文本文件.");
    }
};

const processQuestions = (content) => {
    const questions = content.split(/\n\s*\n/); // 按空行分割
    jsonArray.value = questions.map((question) => {
        const lines = question.split(/\r?\n/).map(line => line.trim()).filter(line => line); // 移除空行

        // Check for true/false question format
        if (lines.length === 3 && lines[1].startsWith('答案：')) {
            const questionText = lines[0].replace(/^\d+\.\s*/, ''); // 移除前面的序号
            const answer = lines[1].replace(/^答案：/, ''); // 去掉“答案：”前缀
            const explanation = lines[2].replace(/^解析：/, ''); // 去掉“解析：”前缀

            return {
                question: questionText,
                options: {}, // No options for true/false
                answer,
                explanation,
                type: "判断题", // 标识题型
            };
        }

        // Process multiple-choice questions
        if (lines.length >= 7) {
            const questionText = lines[0].replace(/^\d+[、．]\s*/, ''); // 移除前面的序号
            const options = {
                A: lines[1].replace(/^A、/, ''), // 去掉“选项A：”前缀
                B: lines[2].replace(/^B、/, ''),
                C: lines[3].replace(/^C、/, ''),
                D: lines[4].replace(/^D、/, ''),
            };
            const answer = lines[5].replace(/^答案：/, ''); // 去掉“答案：”前缀
            const explanation = lines[6].replace(/^解析：/, ''); // 去掉“解析：”前缀

            return {
                question: questionText,
                options,
                answer,
                explanation,
                type: answer.length === 1 ? "单选题" : "多选题", // 根据答案长度判断题型
            };
        }

        return null; // 不符合格式的题目
    }).filter(Boolean);
};

const exportToExcel = () => {
    const formattedData = jsonArray.value.map((item, index) => {
        return {
            序号: index + 1,
            题目类型: item.type,
            题目内容: item.question,
            选项A: item.options.A || '',
            选项B: item.options.B || '',
            选项C: item.options.C || '',
            选项D: item.options.D || '',
            答案: item.answer,
            解析: item.explanation,
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '题目');

    // 导出 Excel 文件
    XLSX.writeFile(workbook, '题目.xlsx');
};
</script>