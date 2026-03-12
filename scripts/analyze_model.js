const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'public', 'models', 'AnatomyModel_Mesh.fbx');

if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

console.log('Reading file (76MB)...');
const content = fs.readFileSync(filePath, 'utf8');
const header = content.slice(0, 100).split('\n')[0];

console.log('--- FBX File Header ---');
console.log(header);

const idToName = new Map();
const idToType = new Map();
const meshIds = [];

// Parse Models
console.log('Parsing Models...');
const modelRegex = /Model:\s*(\d+),\s*"([^"]+)",\s*"([^"]+)"/g;
let match;
while ((match = modelRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2].replace(/^(Model|Material|Texture|Geometry|NodeAttribute)::/, '');
    const type = match[3];
    idToName.set(id, name);
    idToType.set(id, type);
    if (type === 'Mesh') meshIds.push(id);
}

// Parse Geometries and Vertex Counts
console.log('Parsing Geometries and Counts...');
const geoData = new Map();
// Geometry: 123, "Geometry::Name", "Mesh" { ... Vertices: *456 { ... PolygonVertexIndex: *789 { ... } } }
// We use a simplified match for vertex/index arrays
const geoBlockRegex = /Geometry:\s*(\d+),\s*"([^"]+)",\s*"Mesh"\s*\{([\s\S]*?)\}/g;
while ((match = geoBlockRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2].replace(/^(Geometry)::/, '');
    idToName.set(id, name);
    idToType.set(id, 'Geometry');

    const geoContent = match[3];
    const vMatch = geoContent.match(/Vertices:\s*\*(\d+)/);
    const iMatch = geoContent.match(/PolygonVertexIndex:\s*\*(\d+)/);
    geoData.set(id, {
        vertices: vMatch ? parseInt(vMatch[1]) / 3 : 0,
        indices: iMatch ? parseInt(iMatch[1]) : 0
    });
}

// Parse Connections
console.log('Parsing Connections...');
const parentMap = new Map();
const childrenMap = new Map();
const meshToGeo = new Map();
const connectionsBlock = content.match(/Connections:\s*\{([\s\S]*?)\}/);
if (connectionsBlock) {
    const connRegex = /C:\s*"OO",\s*(\d+),\s*(\d+)/g;
    let conn;
    while ((conn = connRegex.exec(connectionsBlock[1])) !== null) {
        const childId = conn[1];
        const parentId = conn[2];

        // Map Mesh to Geometry
        if (geoData.has(childId) && idToType.get(parentId) === 'Mesh') {
            meshToGeo.set(parentId, childId);
        }

        parentMap.set(childId, parentId);
        if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
        childrenMap.get(parentId).push(childId);
    }
}

const roots = [];
for (const [id, name] of idToName.entries()) {
    if (idToType.get(id) === 'Null' || idToType.get(id) === 'Mesh') {
        if (!parentMap.has(id) || parentMap.get(id) === '0' || idToName.get(parentMap.get(id)) === 'RootNode') {
            if (!roots.includes(id)) roots.push(id);
        }
    }
}

console.log(`\n--- Model Hierarchy ---`);

const printTree = (id, indent = '') => {
    const name = idToName.get(id) || `Unknown(${id})`;
    const type = idToType.get(id) || 'Unknown';
    let extra = '';

    if (type === 'Mesh') {
        const geoId = meshToGeo.get(id);
        const data = geoData.get(geoId);
        if (data) {
            extra = ` (${Math.round(data.vertices).toLocaleString()} verts, ${data.indices.toLocaleString()} indices)`;
        }
    }

    console.log(`${indent} - ${name} [${type}]${extra}`);

    const children = (childrenMap.get(id) || []).filter(cid => idToType.get(cid) !== 'Material' && idToType.get(cid) !== 'Texture');
    if (children.length > 0) {
        if (indent.length > 20) return;
        children.forEach(childId => printTree(childId, indent + '  '));
    }
};

roots.forEach(id => {
    if (idToName.get(id) !== 'RootNode') printTree(id);
});

console.log('\n--- TARGETED ANALYSIS ---');
const planes = [];
for (const id of meshIds) {
    const name = idToName.get(id);
    if (name.toLowerCase().includes('plane')) {
        const geoId = meshToGeo.get(id);
        const data = geoData.get(geoId);
        planes.push({ name, ...data });
    }
}

if (planes.length > 0) {
    console.log('Anatomical Planes:');
    planes.forEach(p => console.log(`  * ${p.name}: ${Math.round(p.vertices).toLocaleString()} vertices`));
}

let totalVerts = 0;
geoData.forEach(d => totalVerts += d.vertices);

console.log('\n--- Final Summary ---');
console.log(`Total Meshes: ${meshIds.length}`);
console.log(`Total Geometry Vertices: ${Math.round(totalVerts).toLocaleString()}`);
console.log(`Main Anatomical Structure: ${roots.filter(id => idToName.get(id) !== 'RootNode').map(id => idToName.get(id)).join(', ')}`);
