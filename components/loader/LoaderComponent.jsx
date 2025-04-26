import { Loader } from "lucide-react";
import "./LoaderComponent.css";

export const LoaderComponent = ({ msg }) => {
    return (
        <>
            <div className="loader-container">
                <Loader className="loader-icon" />
                <div className="loading">
                    <p className="loading-text">{msg}</p>
                </div>
            </div>
        </>
    );
};

