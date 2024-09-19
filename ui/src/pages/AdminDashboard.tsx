import { gql, useQuery } from '@apollo/client';

import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
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
  Tag,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  Column,
  Table,
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
import { Link } from 'src/components/Link.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import { GET_USERS } from 'src/graphql/queries.ts';
import { User } from 'src/graphql/schema.ts';

const UsersTable = ({ users }: { users: User[] }) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Email Address',
        accessorKey: 'email',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Last Login',
        accessorKey: 'last_login_at',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Second last Login',
        accessorKey: 'second_last_login_at',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Is Admin',
        accessorKey: 'is_admin',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: 'Can Own Collections',
        accessorKey: 'can_own_collections',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [data, setData] = useState(users);
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
                <Th key={header.id} colSpan={header.colSpan}>
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
