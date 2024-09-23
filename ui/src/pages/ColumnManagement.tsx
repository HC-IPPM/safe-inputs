import { Box, Container } from '@chakra-ui/react';
import { Trans } from '@lingui/macro';

import { useLingui } from '@lingui/react';

import _ from 'lodash';

import React, { memo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import ColumnManagementForm from 'src/components/ColumnManagementForm.tsx';
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
        <Trans>Go to Home</Trans>
      </Link>
    </div>
  );
};

const ColumnManagement = memo(function ColumnManagement({
  session,
}: {
  session: Session;
}) {
  const { collectionID, columnHeader } = useParams() as {
    collectionID: string;
    columnHeader?: string;
  };

  const navigate = useNavigate();

  const {
    i18n: { locale },
  } = useLingui();

  const { loading, error, data } = useCollectionWithColumnDetails({
    variables: { collection_id: collectionID, lang: locale },
    fetchPolicy: 'no-cache',
  });

  const initial_column_state =
    typeof columnHeader !== 'undefined' && !loading && data
      ? data.collection.column_defs.find(
          ({ header }) => header === columnHeader,
        )
      : undefined;

  if (!loading && !data?.collection.is_current_version) {
    setTimeout(() => {
      navigate('/');
    }, 5000);
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
    !data?.collection.owners.some(({ email }) => email === session.email)
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask a team
            member with owner permissions to grant access.
          </Trans>
        }
      />
    );
  } else if (
    !loading &&
    typeof columnHeader === 'string' &&
    typeof initial_column_state === 'undefined'
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Column &quot;{columnHeader}&quot; Not Found</Trans>}
        message={
          <Trans>
            No column with header &quot;{columnHeader}&quot; exists on this
            collection.
          </Trans>
        }
      />
    );
  } else if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <ColumnManagementForm
            collection_id={collectionID}
            initial_column_state={initial_column_state}
          />
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
        <Trans>Column Management</Trans>
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
