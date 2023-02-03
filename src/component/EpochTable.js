import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_EPOCHS, GET_TOTAL_EPOCHS } from "../apollo/queries";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import SearchIcon from "@material-ui/icons/Search";

const EpochTable = () => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState({
    field: "startBlock",
    direction: "asc",
  });

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = useState();

  const startBlock = !search ? undefined : +search;

  const { loading, error, data } = useQuery(GET_EPOCHS, {
    variables: {
      first: 10,
      skip: (page - 1) * 10,
      orderBy: orderBy.field,
      orderDirection: orderBy.direction,
      where: { startBlock },
    },
  });

  const {
    data: countData,
    loading: countLoading,
    error: countError,
  } = useQuery(GET_TOTAL_EPOCHS, {
    variables: { where: { startBlock } },
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSort = (field) => {
    if (orderBy.field === field) {
      setOrderBy({
        field,
        direction: orderBy.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setOrderBy({ field, direction: "asc" });
    }

    setPage(1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const formatEther = (bigNumber) => {
    const formattedNumber = ethers.utils.formatEther(bigNumber);

    return Math.floor(formattedNumber, 2);
  };

  if (error || countError) {
    console.error(error);
    return <p>Error :(</p>;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.searchContainer}>
        <InputBase
          className={classes.searchInput}
          placeholder="Search by Start Block"
          value={search}
          name="startBlock"
          onChange={handleSearchChange}
        />
        <IconButton className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "startBlock"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("startBlock")}
                >
                  Start Block
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "endBlock"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("endBlock")}
                >
                  End Block
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "stakeDeposited"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("stakeDeposited")}
                >
                  Stake Deposited
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "totalQueryFees"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("totalQueryFees")}
                >
                  Total Query Fees
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "totalRewards"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("totalRewards")}
                >
                  Total Rewards
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "totalIndexerRewards"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("totalIndexerRewards")}
                >
                  Total Indexer Rewards
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === "totalDelegatorRewards"}
                  direction={orderBy.direction}
                  onClick={() => handleSort("totalDelegatorRewards")}
                >
                  Total Delegator Rewards
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className={classes.textCenter}>
                  Loading data...
                </TableCell>
              </TableRow>
            ) : (
              data.epoches.map((epoch) => (
                <TableRow key={epoch.id} className={classes.tableRow}>
                  <TableCell>{epoch.startBlock}</TableCell>
                  <TableCell>{epoch.endBlock}</TableCell>
                  <TableCell>{formatEther(epoch.stakeDeposited)}</TableCell>
                  <TableCell>{formatEther(epoch.totalQueryFees)}</TableCell>
                  <TableCell>{formatEther(epoch.totalRewards)}</TableCell>
                  <TableCell>
                    {formatEther(epoch.totalIndexerRewards)}
                  </TableCell>
                  <TableCell>
                    {formatEther(epoch.totalDelegatorRewards)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!countLoading && (
        <Box className={classes.tablePagination}>
          <Pagination
            count={Math.ceil(countData?.epoches?.length / 10)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}
    </Box>
  );
};

export default EpochTable;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
  searchContainer: {
    padding: "2px 4px",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  searchInput: {
    padding: "0 10px",
    backgroundColor: "#F5F5FF",
    minWidth: 300,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#F5F5FF",
    borderRadius: 0,
  },
  tableHead: {
    backgroundColor: "#dcdce0",
  },
  tablePagination: {
    "& > *": {
      marginTop: theme.spacing(2),
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  textCenter: {
    textAlign: "center",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#F5F5FF",
    },
  },
}));
