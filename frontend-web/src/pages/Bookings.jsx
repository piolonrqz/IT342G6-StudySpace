import React from "react";
import { NavigationBar} from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import SpaceContent from "@/Components/SpaceContent";


const Bookings = () => {
    return (
        <div>
        <NavigationBar/>
        <SpaceShowcase/>
        <SpaceContent/>
        <Footer/>
        </div>
    );
};

export default Bookings;