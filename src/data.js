// JSON-based data structure and KG conversion

/**
 * Define a standard data node
 * @param {object} obj - input object
 * @returns {object} standardized node
 */
function toDataNode(obj) {
  return {
    id: obj.id || '',
    type: obj.type || 'entity',
    name: obj.name || '',
    value: obj.value || null,
    meta: obj.meta || {},
    relations: obj.relations || [] // [{type, targetId}]
  };
}

/**
 * Convert array of nodes to KG (knowledge graph)
 * @param {Array<object>} nodes
 * @returns {object} KG {entities, relations}
 */
function toKG(nodes) {
  const entities = [];
  const relations = [];
  nodes.forEach(n => {
    const node = toDataNode(n);
    entities.push({ id: node.id, type: node.type, name: node.name, value: node.value, meta: node.meta });
    node.relations.forEach(r => {
      relations.push({ source: node.id, type: r.type, target: r.targetId });
    });
  });
  return { entities, relations };
}

module.exports = { toDataNode, toKG };
