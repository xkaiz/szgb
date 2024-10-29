/**
 * 日期格式化
 * @param {Date} date 日期
 * @param {Number} type type=0时为 yyyy-MM-dd 00:00:00，type=1时为 yyyy-MM-dd HH:mm:00，type为空时为 yyyy-MM-dd
 */
export const formatDate = (date, type) => {
	date = new Date(date);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	let time = "";
	if (type == 0) {
		time = " 00:00:00";
	} else if (type == 1) {
		time = " " + hours + ":" + minutes + ":00";
	}
	return `${year}-${month}-${day}${time}`;
};
