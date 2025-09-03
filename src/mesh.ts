import { orient, vec3 } from "@peulicke/geometry";
import { applyTransformation, type Transformation } from "@peulicke/geometry/transformation";

export type Mesh = {
    points: vec3.Vec3[];
    faces: [number, number, number][];
    colors: vec3.Vec3[];
};

export const colorMesh = (mesh: Mesh, color: vec3.Vec3): Mesh => ({
    ...mesh,
    colors: mesh.points.map(() => color)
});

export const mergeMeshes = (meshes: Mesh[]): Mesh => {
    const result: Mesh = {
        points: meshes.flatMap(m => m.points),
        faces: [],
        colors: meshes.flatMap(m => m.colors ?? m.points.map((): vec3.Vec3 => [1, 1, 1]))
    };
    let offset = 0;
    meshes.forEach(m => {
        m.faces.forEach(f => {
            result.faces.push([offset + f[0], offset + f[1], offset + f[2]]);
        });
        offset += m.points.length;
    });
    return result;
};

export const transformMesh = (mesh: Mesh, t: Transformation): Mesh => ({
    points: mesh.points.map(p => applyTransformation(p, t)),
    faces: mesh.faces,
    colors: mesh.colors
});

export const moveMesh = (mesh: Mesh, pos: vec3.Vec3): Mesh => ({
    points: mesh.points.map(p => vec3.add(pos, p)),
    faces: mesh.faces,
    colors: mesh.colors
});

export const scaleMesh = (mesh: Mesh, s: vec3.Vec3): Mesh => ({
    points: mesh.points.map(p => vec3.multiply(s, p)),
    faces: mesh.faces,
    colors: mesh.colors
});

export const rotateMesh = (mesh: Mesh, axis: vec3.Vec3, angle: number): Mesh =>
    orientMesh(mesh, orient.fromAxisAngle(axis, angle));

export const orientMesh = (mesh: Mesh, o: orient.Orient): Mesh => ({
    points: mesh.points.map(p => orient.rotateVec3(o, p)),
    faces: mesh.faces,
    colors: mesh.colors
});
