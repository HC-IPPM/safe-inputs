import { useQuery } from '@apollo/client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Container,
  IconButton,
  HStack,
  Button,
  Heading,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Flex,
  Select,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  PaginationState,
  getSortedRowModel,
} from '@tanstack/react-table';
import _ from 'lodash';

import { memo, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSession } from 'src/components/auth/session.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import { GET_USERS } from 'src/graphql/queries.ts';
import { User } from 'src/graphql/schema.ts';

const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp) return '-';

  const date = new Date(timestamp);

  return date.toLocaleString('en-US');
};

const UsersTable = ({ users }: { users: User[] }) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Email Address',
        accessorFn: (row) => row.email,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Created At',
        accessorFn: (row) => formatDate(row.created_at),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Last Login',
        accessorFn: (row) => formatDate(row.last_login_at),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Second last Login',
        accessorFn: (row) => formatDate(row.second_last_login_at),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Is Admin',
        accessorFn: (row) => row.is_super_user,
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        footer: (props) => props.column.id,
      },
      {
        header: 'Can Own Collections',
        accessorFn: (row) => row.can_own_collections,
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [data] = useState(users);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });
  return (
    <Box>
      <TableContainer mb={4}>
        <Table variant="simple">
          <TableCaption placement="top">
            <Heading>
              <Trans>Users</Trans>
            </Heading>
          </TableCaption>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={4}>
          <Button
            onClick={() => table.setPageIndex(0)}
            isDisabled={!table.getCanPreviousPage()}
            leftIcon={<ChevronLeftIcon />}
          >
            First
          </Button>
          <IconButton
            aria-label="Previous Page"
            icon={<ChevronLeftIcon />}
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          />
          <Text>
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
          <IconButton
            aria-label="Next Page"
            icon={<ChevronRightIcon />}
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          />
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
            rightIcon={<ChevronRightIcon />}
          >
            Last
          </Button>
        </HStack>
        <Select
          value={pagination.pageSize}
          onChange={(e) => {
            const size = Number(e.target.value);
            setPagination((old) => ({ ...old, pageSize: size }));
            table.setPageSize(size);
          }}
          width="100px"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </Select>
      </Flex>
    </Box>
  );
};

const AdminDashboardDynamic = memo(function AdminDashboardDynamic() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        <nav>
          <HStack justify={'right'}>
            <IconButton
              aria-label={t`Refresh user lists`}
              title={t`Refresh user lists`}
              icon={<RepeatIcon />}
              onClick={() => refetch()}
            />
          </HStack>
        </nav>
        {data && <UsersTable users={data.users} />}
      </LoadingBlock>
    );
  }
});

export default function AdminDashboard() {
  const { status, session } = useSession({ allow_unauthenticated: false });

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session.is_super_user) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Admin Dashboard</Trans>
      </Box>
      <Container
        maxW="7xl"
        px={{ base: 5, md: 10 }}
        mt={8}
        minH="63vh"
        display={'flex'}
      >
        <LoadingBlock isLoading={status === 'syncing' && !has_session}>
          {has_session && <AdminDashboardDynamic />}
        </LoadingBlock>
      </Container>
    </>
  );
}
