import events from "./events.js";
import ces from "./ces.js";

export default () => {
    events.Subscribe("collision", (event: any) => {
        if (_.has(event.collidable, "cameraTrigger")) {
            var cameraTriggerEntity = event.collidable;
            var cameraEntity = ces.GetEntities("camera")[0];
            cameraEntity.camera.targetX = cameraTriggerEntity.cameraTrigger.targetX;
            cameraEntity.camera.targetY = cameraTriggerEntity.cameraTrigger.targetY;
        }
        return true;
    });

    events.Subscribe("ces.update.camera", (cameraEntity: any) => {
        var dx = cameraEntity.camera.targetX - cameraEntity.position.x;
        var dy = cameraEntity.camera.targetY - cameraEntity.position.y;

        cameraEntity.position.x += dx * 0.01;
        cameraEntity.position.y += dy * 0.01;
        return true;
    });
};