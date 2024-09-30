import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="text-center">
            <div className="flex flex-col gap-5 my-10">
                <span className=" mx-auto px-4 py-2 rounded-full text-[#ba2397] font-medium">
                    No. 1 Job borad Website
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold">
                    Search, Apply & <br /> Get Your{" "}
                    <span className="text-[#ba2397]">Dream Jobs</span>
                </h1>
                <p>
                    Our job portal connects talented individuals with top
                    employers across a wide range of industries. Whether you're
                    a recent graduate or an experienced professional, you’ll
                    find diverse opportunities tailored to your skills and
                    career goals.
                </p>
                <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
                    <input
                        type="text"
                        placeholder="Find your dream jobs"
                        onChange={(e) => setQuery(e.target.value)}
                        className="outline-none border-none w-full bg-transparent"
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="rounded-r-full"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
