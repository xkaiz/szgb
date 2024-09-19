import request from "@/utils/Request";

export default {
    test() {
        const data = {
            department: {
                id: "",
            },
        };
        return request({
            url: "/sys/user/list",
            method: "post",
            data: data,
        });
    },
};
