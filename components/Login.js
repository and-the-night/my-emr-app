export default function Login({ onLogin }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        onLogin(email.value, password.value);
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="text" autoComplete="email" required />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>

            <button type="submit">Sign in</button>
        </form>
    );
}