import { version } from "vue";

/**
 * 构建树形结构
 * 通过遍历数据数组，将具有层级关系的数据转换为树形结构
 *
 * @param {Array} data - 一个包含节点信息的数组，每个节点有id和parentId字段
 * @returns {Array} - 返回一个数组，其中包含构建好的树形结构
 */
export const buildTree = (data) => {
	// 创建一个临时对象，用于存储所有节点的映射关系
	const map = {};
	// 创建一个数组，用于存储最终构建好的树的根节点
	const tree = [];

	// 第一次遍历数据，为每个节点在map中创建一个映射
	data.forEach((item) => {
		// 在map中以节点的id为键，存储一个对象，包括该节点的标签和一个空的子节点数组
		map[item.id] = { label: item.name, value: item.id, parent: item.parent == null ? "" : item.parent.id, children: [], dictChildren: item.dictChildren, version: item.version };
	});

	// 第二次遍历数据，根据parentId将节点添加到对应的父节点的子节点数组中
	data.forEach((item) => {
		// 如果节点的parentId为null，说明它是根节点，直接添加到树的根节点数组中
		if (item.parent == null) {
			tree.push(map[item.id]);
		} else {
			// 如果父节点存在，则将当前节点添加到父节点的子节点数组中
			if (map[item.parent.id]) {
				map[item.parent.id].children.push(map[item.id]);
			}
		}
	});

	// 返回构建好的树的根节点数组
	return tree;
};
