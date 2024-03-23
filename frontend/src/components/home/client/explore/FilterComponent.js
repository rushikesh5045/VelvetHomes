import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const FilterComponent = ({
  onFilterChange,
  uniqueCompanies,
  companyDetailsMap,
}) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const applyFilter = () => {
    if (
      (minPrice === "" || !isNaN(minPrice)) &&
      (maxPrice === "" || !isNaN(maxPrice)) &&
      (selectedCompany === "" || uniqueCompanies.includes(selectedCompany))
    ) {
      onFilterChange({
        minPrice: minPrice === "" ? "" : parseFloat(minPrice),
        maxPrice: maxPrice === "" ? "" : parseFloat(maxPrice),
        company: selectedCompany,
      });
    }
  };

  return (
    <>
      <Box
        mt={2}
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="spcae-between"
      >
        <div style={{ marginRight: "8px", flex: "1" }}>
          <TextField
            type="number"
            label="Min Price"
            variant="outlined"
            fullWidth
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ marginBottom: "8px" }}
            InputProps={{ style: { fontSize: "0.9rem" } }}
          />
        </div>
        <div style={{ marginRight: "8px", flex: "1" }}>
          <TextField
            type="number"
            label="Max Price"
            variant="outlined"
            fullWidth
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ marginBottom: "8px" }}
            InputProps={{ style: { fontSize: "0.9rem" } }}
          />
        </div>
        <div style={{ flex: "1" }}>
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "8px" }}
          >
            <InputLabel id="company-label" style={{ fontSize: "0.9rem" }}>
              Company
            </InputLabel>
            <Select
              labelId="company-label"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              label="Company"
              style={{ fontSize: "0.9rem" }}
            >
              <MenuItem value="">
                <em>ALL</em>
              </MenuItem>
              {uniqueCompanies.map((company) => (
                <MenuItem key={company} value={company}>
                  {companyDetailsMap[company]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ marginLeft: "10px", flex: "1" }}>
          <Button
            variant="contained"
            onClick={applyFilter}
            style={{
              backgroundColor: "black",
              color: "whitesmoke",
              fontSize: "10px",
            }}
          >
            Apply Filter
          </Button>
        </div>
      </Box>
    </>
  );
};

export default FilterComponent;
