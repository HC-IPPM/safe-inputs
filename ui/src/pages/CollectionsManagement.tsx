import { gql, useMutation, useQuery } from '@apollo/client';

import { Box, Container } from '@chakra-ui/react';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import _ from 'lodash';
import React, { memo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import CollectionForm from 'src/components/CollectionForm.tsx';

import { Link } from 'src/components/Link.tsx';

import { LoadingBlock } from 'src/components/Loading.tsx';

const GET_COLLECTION_DETAILS = gql`
  query CollectionDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      id
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      created_at
      is_locked
      name_en
      name_fr
      description_en
      description_fr
      owners {
        email
      }
      uploaders {
        email
      }
      column_defs {
        header
        name(lang: $lang)
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`;

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
const CollectionMainPage = memo(function CollectionMainPage({
  session,
}: {
  session: Session;
}) {
  const { collectionID } = useParams();
  const location = useLocation();
  const redirect = location.state?.redirect || false;

  const {
    i18n: { locale },
  } = useLingui();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_COLLECTION_DETAILS, {
    variables: { collection_id: collectionID, lang: locale },
    fetchPolicy: 'network-only',
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
    !data.collection.owners?.some(
      (owner: { email: string }) => owner.email === session.email,
    )
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask the a
            team member with owner permissions to grant access.
          </Trans>
        }
      />
    );
  } else if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && <CollectionForm data={data?.collection} redirect={redirect} />}
      </LoadingBlock>
    );
  }
});

export default function CollectionManagementPage() {
  const { status, session } = useSession();

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session?.can_own_collections) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Collection Management</Trans>
      </Box>
      <Container
        maxW="7xl"
        px={{ base: 5, md: 10 }}
        mt={8}
        minH="63vh"
        display={'flex'}
      >
        <LoadingBlock isLoading={status === 'syncing' && !has_session}>
          {has_session && <CollectionMainPage session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
