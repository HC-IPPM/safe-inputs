import { Trans } from '@lingui/react/macro';
import { Box, Container, Heading } from '@chakra-ui/react';

import { useLingui } from '@lingui/react';

import React, { memo } from 'react';

import { useNavigate, useParams } from 'react-router';

import { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { ColumnManagementForm } from 'src/components/ColumnManagementForm.tsx';
import { Link } from 'src/components/Link.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';

import { useCollectionWithColumnDetails } from 'src/graphql/index.ts';

const ErrorDisplay = function ({
  title,
  message,
}: {
  title: React.ReactNode;
  message: React.ReactNode;
}) {
  return (
    <div style={{ height: '50%' }} className="error-container">
      <h2>{title}</h2>
      <div className="error-message">{message}</div>
      <Link className="error-home-button" to="/">
        <Trans>Home</Trans>
      </Link>
    </div>
  );
};

const ColumnManagement = memo(function ColumnManagement({
  session,
}: {
  session: Session;
}) {
  const { collectionId, columnId } = useParams() as {
    collectionId: string;
    columnId?: string;
  };

  const {
    i18n: { locale },
  } = useLingui();

  const { loading, error, data } = useCollectionWithColumnDetails({
    variables: { collection_id: collectionId, lang: locale },
    fetchPolicy: 'no-cache',
  });

  const initial_column_state =
    typeof columnId !== 'undefined' && !loading && data
      ? data.collection?.column_defs.find(({ id }) => id === columnId)
      : undefined;

  if (error) {
    throw error;
  } else if (!loading && !data?.collection?.is_current_version) {
    return (
      <ErrorDisplay
        title={<Trans>Cannot update stale version of Collection</Trans>}
        message={
          <Trans>
            You can only update the latest version of a collection. The
            collection you were viewing may have become stale. Please return to
            the home page and look for the latest version.
          </Trans>
        }
      />
    );
  } else if (
    !loading &&
    !data?.collection?.owners.some(({ email }) => email === session.email) &&
    !session.is_super_user
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask a team
            member with owner permissions to grant you access.
          </Trans>
        }
      />
    );
  } else if (
    !loading &&
    typeof columnId === 'string' &&
    typeof initial_column_state === 'undefined'
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Column &quot;{columnId}&quot; Not Found</Trans>}
        message={
          <Trans>
            No column with ID &quot;{columnId}&quot; exists on this collection.
          </Trans>
        }
      />
    );
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <>
            <Heading as="h2" size="md" mb={6}>
              {initial_column_state?.header ? (
                <Trans>Edit Column</Trans>
              ) : (
                <Trans>Create New Column</Trans>
              )}
            </Heading>
            <ColumnManagementForm
              collectionId={collectionId}
              columnId={columnId}
              initialColumnState={initial_column_state}
            />
          </>
        )}
      </LoadingBlock>
    );
  }
});

export default function ColumnManagementPage() {
  const { status, session } = useSession();

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session?.can_own_collections) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Column Management</Trans>
        </h1>
      </Box>
      <Container
        maxW="7xl"
        px={{ base: 5, md: 10 }}
        mt={8}
        minH="63vh"
        display={'flex'}
      >
        <LoadingBlock isLoading={status === 'syncing' && !has_session}>
          {has_session && <ColumnManagement session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
