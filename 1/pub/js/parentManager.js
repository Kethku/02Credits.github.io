System.register(["./ces", "./animationManager", "./webglManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isChild(entity) { return "child" in entity; }
    exports_1("isChild", isChild);
    function setup() {
        animationManager_1.Update.Subscribe(() => {
            for (let childEntity of ces.getEntities(isChild, true)) {
                let parent = ces.getEntity(childEntity.parent);
                if (webglManager_1.isRenderable(parent)) {
                    let parentRotation = parent.rotation || 0;
                    let parentScale = parent.scale || 1;
                    let parentX = parent.position.x || 0;
                    let parentY = parent.position.y || 0;
                    // let parentAlpha = parent.rendered.alpha || 1;
                    childEntity.child.relativePosition = childEntity.child.relativePosition || { x: 0, y: 0, z: 0 };
                    childEntity.position.x =
                        (Math.cos(parentRotation) * childEntity.child.relativePosition.x -
                            Math.sin(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
                            parentX;
                    childEntity.position.y =
                        (Math.sin(parentRotation) * childEntity.child.relativePosition.x +
                            Math.cos(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
                            parentY;
                    childEntity.child.relativeRotation = childEntity.child.relativeRotation || 0;
                    childEntity.rotation = childEntity.child.relativeRotation + parentRotation;
                    childEntity.child.relativeScale = childEntity.child.relativeScale || 1;
                    childEntity.scale = childEntity.child.relativeScale * parentScale;
                    // childEntity.child.relativeAlpha = childEntity.child.relativeAlpha || 1;
                    // childEntity.rendered.alpha = childEntity.child.relativeAlpha * parentAlpha;
                    if ("enabled" in parent) {
                        childEntity.enabled = parent.enabled;
                    }
                    else {
                        childEntity.enabled = true;
                    }
                }
            }
        });
    }
    exports_1("setup", setup);
    var ces, animationManager_1, webglManager_1;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (webglManager_1_1) {
                webglManager_1 = webglManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=parentManager.js.map