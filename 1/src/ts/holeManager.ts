import {Collision, Entity as CollidableEntity} from "./collisionManager";
import {isRenderable} from "./pixiManager";
import {EventManager1} from "./eventManager";

import {CombinedEntity} from "./entity";

export let Fell = new EventManager1<any>();

interface FallableEntity extends CollidableEntity {
    fallable: boolean
}
export function isFallable(entity: CombinedEntity): entity is FallableEntity { return "fallable" in entity; };

interface HoleEntity extends CollidableEntity {
    hole: {
        steepness: number
    }
}
export function isHole(entity: CombinedEntity): entity is HoleEntity { return "hole" in entity; };

export type Entity = FallableEntity | HoleEntity;

export function Setup() {
    Collision.Subscribe((fallable, collidable, details) => {
        if (isFallable(fallable)) {
            if (isHole(collidable)) {
                if (details.depth > Math.max(fallable.dimensions.width, fallable.dimensions.height)) {
                    fallable.position.x = collidable.position.x;
                    fallable.position.y = collidable.position.y;
                    Fell.Publish(fallable);
                } else {
                    fallable.position.x += details.normal[0] * details.depth * collidable.hole.steepness;
                    fallable.position.y += details.normal[1] * details.depth * collidable.hole.steepness;
                }

                var factor = 1.2 - details.depth * 0.2;
                if (factor < 0) {
                    factor = 0;
                }

                if (factor > 1) {
                    factor = 1;
                }

                if (isRenderable(fallable)) {
                    fallable.rendered.alpha = factor;
                    fallable.rendered.scale = factor;
                }
            }
        }
    });
}
