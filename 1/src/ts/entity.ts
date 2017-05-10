import {Entity as CameraManagerEntity} from "./cameraManager";
import {Entity as CollisionManagerEntity} from "./collisionManager";
import {Entity as HoleManagerEntity} from "./holeManager";
import {Entity as ParentManagerEntity} from "./parentManager";
import {Entity as WebGLEntity} from "./webglManager";
import {Entity as PlayerManagerEntity} from "./playerManager";
import {Entity as StatueManagerEntity} from "./statueManager";
import {Entity as TriggerManagerEntity} from "./triggerManager";
import {Entity as WallManagerEntity} from "./wallManager";

export type CombinedEntity =
  CameraManagerEntity |
  CollisionManagerEntity |
  HoleManagerEntity |
  ParentManagerEntity |
  WebGLEntity |
  PlayerManagerEntity |
  StatueManagerEntity |
  TriggerManagerEntity |
  WallManagerEntity;
