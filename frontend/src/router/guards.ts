import type { RouteLocationNormalized } from "vue-router";
import type {
  AuthenticatedActor,
  BackofficeCapability,
} from "../modules/auth/types";

export type GuardDecision =
  | { readonly kind: "allow" }
  | { readonly kind: "redirect"; readonly name: "entry-denied" | "forbidden" };

export function resolveGuardDecision(
  to: RouteLocationNormalized,
  actor: AuthenticatedActor | null,
): GuardDecision {
  if (to.meta.public === true) {
    return { kind: "allow" };
  }

  if (!actor) {
    return { kind: "redirect", name: "entry-denied" };
  }

  const requiredCapability = to.meta.capability as
    | BackofficeCapability
    | undefined;
  if (!requiredCapability) {
    return { kind: "allow" };
  }

  if (actor.capabilities.includes(requiredCapability)) {
    return { kind: "allow" };
  }

  return { kind: "redirect", name: "forbidden" };
}
