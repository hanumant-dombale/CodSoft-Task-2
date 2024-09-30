import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        searchCompanyByText: "",
        companies: [],
    },
    reducers: {
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
    },
});

export default companySlice.reducer;
export const { setSingleCompany, setCompanies, setSearchCompanyByText } =
    companySlice.actions;
