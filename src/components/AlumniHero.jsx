import "./AlumniHero.css";
import logo from "../assets/logo.png";

const AlumniHero = () => {
    return (
        <section className="hero">
        <img src={logo} alt="Logo" className="hero-logo" />

        

            <button className="login-btn">LOGIN</button>
            <div className="hero-content">
                <h1>Alumni Hub</h1>
                <p>Your Network &nbsp; Your Legacy <br />
                Your Community</p>

            </div>
        </section>

        
    );
};
export default AlumniHero;
