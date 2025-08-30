export type LoginForm = {
    email: string;
    password: string;
};

export type Role = "PARENT" | "TEEN" | "CHILD";

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash?: string;
    birthdate: string;   // ISO (YYYY-MM-DD)
    role: Role;
    parentId?: string | null;
    createdAt: string;   // ISO
}

export type SignUpForm = {
    name: string;
    email: string;
    password: string;
    birthdate: string;   // YYYY-MM-DD (input type="date" döndürüyor)
    role: Role;
    parentId?: string | null;
}
export const initialLoginForm: LoginForm = { email: "", password: "" };
export const initialSignUpForm: SignUpForm = {
    name: "",
    email: "",
    password: "",
    birthdate: "",
    role: "PARENT",
    parentId: null,
}