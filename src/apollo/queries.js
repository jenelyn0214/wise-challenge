import { gql } from "@apollo/client";

export const GET_EPOCHS = gql`
  query GetEpochs(
    $first: Int
    $skip: Int
    $orderBy: Epoch_orderBy
    $orderDirection: OrderDirection
    $where: Epoch_filter
  ) {
    epoches(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      startBlock
      endBlock
      signalledTokens
      stakeDeposited
      totalQueryFees
      taxedQueryFees
      queryFeesCollected
      curatorQueryFees
      queryFeeRebates
      totalRewards
      totalIndexerRewards
      totalDelegatorRewards
    }
  }
`;

export const GET_TOTAL_EPOCHS = gql`
  query GetTotalEpoches($where: Epoch_filter) {
    epoches(where: $where) {
      id
    }
  }
`;
