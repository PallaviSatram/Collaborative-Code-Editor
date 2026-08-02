import "./Auth.css";

function AuthCard({ title, children }) {

    return (

        <div className="auth-card">

            <h2>{title}</h2>

            {children}

        </div>

    );

}

export default AuthCard;