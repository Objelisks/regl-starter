# spatial partitioning

## rbush

use for 2d queries
supports points in rect
https://github.com/mourner/rbush

3d queries??
https://github.com/Eronana/rbush-3d

## ball tree

cute
supports nearest neighbor point
gonna need to implement it in js
https://github.com/grantslatton/ball-tree
https://en.wikipedia.org/wiki/Ball_tree

## raycasting

object picking need to cast against the triangles on a mesh.
this engine is optimized for lowpoly stuff so don't worry too much about iterating over triangles,
but we wanna cull as many meshes total from testing

on render: when we draw a mesh, add it's bounding box to the oct-tree (transformed to world space)
after render: do raycasting and updates

collider flag? only cast against bounding boxes? (intentionally squishy hits)
detailed collision flag

physics??

