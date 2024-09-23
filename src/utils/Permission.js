import useStore from "@/store/index";
const store = useStore();

const levels = [
    { level: 1, roles: [0] },
    { level: 2, roles: [1] },
    { level: 3, roles: [2] },
];

export const permission = () => {
    const role = store.user.role.split(",");
    //判断role数组中包含在levels中的哪一个中
    const level = levels.find((item) => item.roles.some((r) => role.includes(r)));

}