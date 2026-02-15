import React from "react";
import "./GlassButton.css";

interface GlassButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
}

const GlassButton: React.FC<GlassButtonProps> = ({ text, type = "button" }) => (
    <div className="button-wrap">
        <button type={type}>
            <span>{text}</span>
        </button>
        <div className="button-shadow"></div>
    </div>
);

export default GlassButton;