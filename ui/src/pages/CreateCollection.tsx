import { Trans } from '@lingui/react/macro';

import { Box, Container } from '@chakra-ui/react';

import { memo } from 'react';

import { useNavigate } from 'react-router';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { CollectionManagementForm } from 'src/components/CollectionManagementForm.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';

// memoizing on session so that the session sync on browser focus won't trigger rerenders
// TODO: most routes will deal with this, bake it in to some sort of route level component
// (along with other things to standardize like headers and container layouts)
const CreateCollectionContent = memo(function CreateCollectionContent({
  session,
}: {
  session: Session;
}) {
  const navigate = useNavigate();

  if (session !== null && !session.can_own_collections) {
    navigate('/');
  } else {
    return <CollectionManagementForm />;
  }
});

export default function CreateCollection() {
  const { status, session } = useSession({ allow_unauthenticated: false });

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
