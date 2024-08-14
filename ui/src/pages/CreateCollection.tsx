import { gql, useMutation } from '@apollo/client';

import { Box, Container } from '@chakra-ui/react';

import { Trans } from '@lingui/macro';

import _ from 'lodash';

import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';

const CREATE_COLLECTION_INIT = gql`
  mutation CreateCollectionInit($collection_def: CollectionDefInput!) {
    create_collection_init(collection_def: $collection_def) {
      id
    }
  }
`;

// TODO at some point, I'll integrate a tool to generate types from queries
type CollectionDefInput = {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  is_locked: boolean;
  owner_emails: string[];
  uploader_emails: string[];
};

// memoizing on session so that the session sync on browser focus won't trigger rerenders
// TODO: most routes will deal with this, bake it in to some sort of route level component
// (along with other things to standardize like headers and container layouts)
const CreateCollectionContent = memo(function CreateCollectionContent({
  session,
}: {
  session: Session;
}) {
  const navigate = useNavigate();

  const [createCollectionInit, { data, loading, error }] = useMutation(
    CREATE_COLLECTION_INIT,
  );

  if (session !== null && !session.can_own_collections) {
    navigate('/');
  } else if (error) {
    // TODO will need error handling for input errors vs network/other errors
    throw error;
  } else {
    return <div>TODO</div>;
  }
});

export default function CreateCollection() {
  const { status, session } = useSession();

  const has_session = session !== null;

  // TODO: bad page boilerplate, staying consistent with other pages for now but I've opened issues to clean them all up
  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Create Collection</Trans>
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
          {has_session && <CreateCollectionContent session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
