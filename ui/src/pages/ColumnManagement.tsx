import { useQuery } from '@apollo/client';
import { Box, Container } from '@chakra-ui/react';
import { Trans } from '@lingui/macro';

import { useLingui } from '@lingui/react';
import React, { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Session } from 'src/components/auth/auth_utils.ts';

import { useSession } from 'src/components/auth/session.tsx';
import ColumnManagementForm from 'src/components/ColumnManagementForm.tsx';
import { Link } from 'src/components/Link.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import { GET_COLUMN_DETAILS } from 'src/graphql/queries.ts';
import type { User } from 'src/graphql/schema.d.ts';

const ErrorDisplay = function ({
  title,
  message,
  homeButton = true,
}: {
  title: React.ReactNode;
  message: React.ReactNode;
  homeButton?: boolean;
}) {
  return (
    <div style={{ height: '50%' }} className="error-container">
      <h2>{title}</h2>
      <div className="error-message">{message}</div>
      {homeButton && (
        <Link className="error-home-button" to="/">
          <Trans>Go to Home</Trans>
        </Link>
      )}
    </div>
  );
};

const ColumnManagement = memo(function ColumnManagement({
  session,
}: {
  session: Session;
}) {
  const { collectionID, columnHeader } = useParams();
  const navigate = useNavigate();
  const {
    i18n: { locale },
  } = useLingui();
  const { loading, error, data } = useQuery(GET_COLUMN_DETAILS, {
    variables: { collection_id: collectionID, lang: locale },
    fetchPolicy: 'no-cache',
  });

  if (!loading && !data.collection.is_current_version) {
    setTimeout(() => {
      navigate('/');
    }, 5000);
    return (
      <ErrorDisplay
        title={<Trans>Cannot update stale version of Collection</Trans>}
        message={
          <Trans>
            You can only update the latest version of a collection. You will be
            redirected back shortly.
          </Trans>
        }
        homeButton={false}
      />
    );
  } else if (
    !loading &&
    !data.collection.owners.some((owner: User) => owner.email === session.email)
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
  } else if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <ColumnManagementForm
            collection={data?.collection}
            columnHeader={columnHeader}
            locale={locale}
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
