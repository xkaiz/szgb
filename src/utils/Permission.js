import useStore from "@/store/index";
const store = useStore();

const levels = [
	{ level: 1, roles: ["0"] },
	{ level: 2, roles: ["1"] },
	{ level: 3, roles: ["2"] },
];

export const permission = () => {
	const roles = store.user.role.split(",");
	const levelsFound = levels.filter((l) => l.roles.some((role) => roles.includes(role))).map((l) => l.level);
	store.setRoleLevel(levelsFound.length > 0 ? Math.min(...levelsFound) : null);
};
