import JSConfetti from "js-confetti";

let confetti: JSConfetti | undefined;

const confettiColors = [
	"#f06e8e", "#45b3e1", "#4bb530", "#f9a400", "#bb35ea", "#dd1818", "#ffca2c",
];

export function showConfetti() {
	if (!process.client) return;
	if (!confetti) confetti = new JSConfetti();
	confetti.addConfetti({
		confettiColors,
	});
}
