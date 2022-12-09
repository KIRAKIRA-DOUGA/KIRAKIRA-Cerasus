import JSConfetti from "js-confetti";

let confetti: JSConfetti | undefined;

export function showConfetti() {
	if (!confetti) confetti = new JSConfetti();
	confetti.addConfetti();
}
