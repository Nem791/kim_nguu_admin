import { Link } from "react-router";
import Box from "@mui/material/Box";

import { FinefoodsLogoIcon, FinefoodsLogoText } from "../icons/finefoods-logo";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Link to="/">
      <Box
        display="flex"
        alignItems="center"
        gap={"12px"}
        sx={{
          color: "text.primary",
        }}
      >
        {collapsed ? (
          // <FinefoodsLogoIcon />
          <FinefoodsLogoText maxWidth="400px" width="40vw" minWidth="260px" />
        ) : (
          <>
            {/* <FinefoodsLogoIcon /> */}
            <FinefoodsLogoText marginLeft="-18px" width="240px" />
          </>
        )}
      </Box>
    </Link>
  );
};
