const domains = ["example.com", "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "mail.ru", "yandex.ru", "icloud.com"];
const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Daniel", "Olivia", "William", "Sophia", "Matthew", "Ella", "Christopher", "Ava", "Andrew", "Grace", "James", "Chloe", "Benjamin", "Lily", "Joseph", "Mia", "Robert", "Charlotte"];
const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Anderson", "Lee", "Clark", "Taylor", "Moore", "White", "Hall", "Thomas", "Harris", "Martin", "Jackson", "Thompson", "Garcia", "Martinez", "Lopez", "Hernandez", "Young", "King", "Wright"];

export function getUserRoleId(userRoles: string[]): string {
	const randomIndex = Math.floor(Math.random() * userRoles.length);

	return userRoles[randomIndex] as string;
}

export function generateRandomEmail(): string {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let email = "";

	const emailLength = Math.floor(Math.random() * (10 - 5 + 1)) + 7;

	for (let i = 0; i < emailLength; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);

		email += characters[randomIndex];
	}

	const randomDomainIndex = Math.floor(Math.random() * domains.length);
	const domain = domains[randomDomainIndex];

	email += `@${domain}`;

	return email;
}

export function getRandomFirstName(): string {
	const randomIndex = Math.floor(Math.random() * firstNames.length);

	return firstNames[randomIndex] as string;
}

export function getRandomLastName(): string {
	const randomIndex = Math.floor(Math.random() * lastNames.length);

	return lastNames[randomIndex] as string;
}
