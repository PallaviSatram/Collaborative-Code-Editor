import "./Auth.css";

function AuthInput({

    label,

    type = "text",

    value,

    onChange,

    placeholder,

}) {

    return (

        <div className="auth-input-group">

            <label>{label}</label>

            <input

                type={type}

                value={value}

                placeholder={placeholder}

                onChange={onChange}

            />

        </div>

    );

}

export default AuthInput;