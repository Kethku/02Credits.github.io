import * as input from "./inputManager";
import * as ces from "./ces";
import * as utils from "./utils"
import ObjectPool from "./objectPool";
import {Update} from "./animationManager";
import {Entity as RenderedEntity} from "./webglManager";
import {Entity as ChildEntity} from "./parentManager";
import {Entity as MotionEntity} from "./motionManager";

import {CombinedEntity} from "./entity";

export interface PlayerEntity extends RenderedEntity, MotionEntity {
  player: {
    particleCount: number,
    stepSpeed: number,
    stepSize: number,
    dashLength: number,
    particleBase: string,
    footBase: string,
    speed?: number,
    walkAnimation?: number,
    dashStartTime?: number,
    lastDashed?: number,
    pool?: ObjectPool<PlayerParticle>
  },
  enabled?: boolean
}
export function isPlayer(entity: CombinedEntity): entity is PlayerEntity { return "player" in entity; };

export interface FootEntity extends RenderedEntity, ChildEntity {
  foot: boolean
}
export function isFoot(entity: CombinedEntity): entity is FootEntity { return "foot" in entity; }

export interface PlayerParticle extends RenderedEntity, MotionEntity {
  playerParticle: boolean
}
export function isPlayerParticle(entity: CombinedEntity): entity is PlayerParticle { return "playerParticle" in entity; }

export type Entity = PlayerEntity | FootEntity | PlayerParticle;

function updateFeet(playerEntity: PlayerEntity) {
  var scale = 1;
  if ("scale" in playerEntity) {
    scale = playerEntity.scale;
  }

  var feet = ces.getEntities(isFoot);
  for (let entity of feet) {
    entity.child.relativePosition.y =
      Math.sin(playerEntity.player.walkAnimation) * // Move steps by sin wave
      playerEntity.player.stepSize *                // Account for settings
      playerEntity.player.speed *                   // Step faster as you walk faster
      entity.child.relativePosition.x *             // Account for which foot and scale a bit
      scale;
  }
}

function updatePlayer(entity: PlayerEntity, time: number) {
  let mouseState = input.MouseState();
  if ("enabled" in entity && !entity.enabled) {
    let particles = ces.getEntities(isPlayerParticle);
    let effectingParticles: PlayerParticle[];
    if (time - entity.player.dashStartTime > entity.player.dashLength) {
      effectingParticles = particles;
    } else {
      let closeParticles = particles.filter(p => utils.length(utils.sub(p.position, mouseState.position)) < entity.dimensions.x / 2);
      if (closeParticles.length > 0) {
        effectingParticles = closeParticles;
      }
    }

    if (effectingParticles) {
      entity.position = utils.sum(
        {x: 0, y: 0, z: entity.position.z},
        utils.flatten(utils.average(effectingParticles.map(p => p.position)))
      );
      entity.velocity = utils.flatten(utils.average(effectingParticles.map(p => p.velocity)));
      entity.player.lastDashed = time;
      entity.enabled = true;
    }
  } else {
    let strengthLevel = (entity.player.particleCount - 5) / 25;
    if (mouseState.mouseButtons.left && (time - entity.player.lastDashed) > (1 - strengthLevel) * 1.5) {
      for (let i = 0; i < entity.player.particleCount; i++) {
        let particle = entity.player.pool.New();
        particle.velocity = utils.scale(utils.normalize({x: Math.random() - 0.5, y: Math.random() - 0.5, z: 0}), Math.random() + 0.5);
        particle.position = entity.position;
        ces.addEntity(particle);
      }
      entity.enabled = false;
      entity.player.dashStartTime = time;
    } else {
      let delta = {x: 0, y: 0, z: 0};
      if (input.KeyDown("a")) {
        delta.x -=  10;
      }
      if (input.KeyDown("d")) {
        delta.x += 10;
      }
      if (input.KeyDown("w")) {
        delta.y += 10;
      }
      if (input.KeyDown("s")) {
        delta.y -= 10;
      }

      entity.rotation = utils.xyAngle(entity.velocity) + Math.PI / 2;
      let length = utils.length(delta);
      if (length != 0) {
        delta = utils.shrink(delta, length);
      }
      entity.velocity = utils.sum(entity.velocity, utils.scale(delta, 0.1));

      var playerSpeed = utils.length(entity.velocity);
      entity.player.speed = playerSpeed;
      entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
    }
  }
}

function updatePlayerParticle(entity: PlayerParticle) {
  let mouseState = input.MouseState();
  let playerEntities = ces.getEntities(isPlayer)
  let target: utils.Point;
  if (playerEntities.length != 0) {
    let playerEntity = playerEntities[0];
    target = playerEntity.position;
    if (utils.length(utils.sub(entity.position, playerEntity.position)) < playerEntity.dimensions.x / 2) {
      ces.removeEntity(entity);
      playerEntity.player.pool.Free(entity);
    }
  } else {
    target = mouseState.position;
  }
  entity.velocity = utils.sum(utils.scale(utils.normalize(utils.sub(target, entity.position)), 0.1), entity.velocity);
}

export function setup() {
  ces.EntityAdded.Subscribe((entity) => {
    if (isPlayer(entity)) {
      entity.velocity = {x: 0, y: 0, z: 0};
      entity.player.walkAnimation = 0;
      entity.player.lastDashed = -Infinity;
      let particleBase = ces.getEntity(entity.player.particleBase) as any;
      entity.player.pool = new ObjectPool({
          ...particleBase,
        velocity: {x: 0, y: 0, z: 0},
        playerParticle: true,
        enabled: true
      });
      let footBase = ces.getEntity(entity.player.footBase);
      let footPool = new ObjectPool({
          ...footBase,
        enabled: true
      });
      let rightFoot = ces.addEntity({
          ...footPool.New(),
        id: "rightFoot",
        child: {
          relativePosition: {
            x: 1
          }
        }
      });
      let leftFoot = ces.addEntity({
          ...footPool.New(),
        id: "leftFoot",
        child: {
          relativePosition: {
            x: -1
          }
        }
      });
    }
  });

  Update.Subscribe((time) => {
    for (let entity of ces.getEntities(isPlayer, true)) {
      updatePlayer(entity, time);
      updateFeet(entity);
    }

    for (let entity of ces.getEntities(isPlayerParticle)) {
      updatePlayerParticle(entity);
    }
  });
}