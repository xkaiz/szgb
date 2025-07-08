<template>
    <div>
        <label for="roadBridgeFile">路桥点表</label>
        <input id="roadBridgeFile" type="file" @change="handleFileChange" accept=".xlsx,.xls" />
        <label for="nanruiFile">南瑞点表</label>
        <input id="nanruiFile" type="file" @change="handleAnotherFileChange" accept=".xlsx,.xls" />
        <button @click="compareJsonData">进行比较</button>
        <pre v-if="comparisonResult">{{ comparisonResult }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import XLSX from 'xlsx';

const fileInput = ref(null);
const firstJsonData = ref({});
const secondJsonData = ref([]);
const comparisonResult = ref(null);

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[3];
            const worksheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const jsonData = {};

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    const cell = worksheet[cellAddress];
                    if (cell) {
                        const cellValue = cell.v.toString();

                        const messageRegex = /收到“([^”]+)”报文/g;
                        let messageMatch;
                        while ((messageMatch = messageRegex.exec(cellValue)) !== null) {
                            const message = messageMatch[1];

                            const levelRegex = /（报警等级：(\d+)）/g;
                            const levelMatch = levelRegex.exec(cellValue);
                            if (levelMatch) {
                                const level = levelMatch[1];
                                jsonData[message] = level;
                            }
                        }
                    }
                }
            }

            firstJsonData.value = jsonData;
        };

        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('读取文件时出错:', error);
    }
};

const handleAnotherFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const jsonData = [];
            let lastCValue = null;

            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cCellAddress = XLSX.utils.encode_cell({ r: R, c: 2 });
                const dCellAddress = XLSX.utils.encode_cell({ r: R, c: 3 });
                const jCellAddress = XLSX.utils.encode_cell({ r: R, c: 9 });

                const cCell = worksheet[cCellAddress];
                const dCell = worksheet[dCellAddress];
                const jCell = worksheet[jCellAddress];

                if (cCell) {
                    lastCValue = cCell.v.toString();
                }

                if (dCell && jCell) {
                    const rowData = {
                        C: lastCValue,
                        D: dCell.v.toString(),
                        J: jCell.v.toString()
                    };
                    jsonData.push(rowData);
                }
            }

            secondJsonData.value = jsonData;
        };

        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('读取另一个文件时出错:', error);
    }
};

const compareJsonData = () => {
    if (Object.keys(firstJsonData.value).length === 0 || secondJsonData.value.length === 0) {
        return;
    }

    const result = {};
    for (const key in firstJsonData.value) {
        let matchFound = false;
        for (const row of secondJsonData.value) {
            const dValue = row.D;
            const jValue = row.J;
            if (key.includes(dValue) && firstJsonData.value[key] === jValue) {
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            result[key] = false;
        }
    }

    comparisonResult.value = JSON.stringify(result, null, 2);
    console.log('比较结果的JSON数据:', result);
};
</script>