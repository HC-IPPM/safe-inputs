import React from 'react'

import { LinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Divider,
  HStack,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function TermsConditions() {
  const { t } = useTranslation()

  return (
    <>
      <Box className="App-header" mb={2}>
        {t('footer.termsConditions')}
      </Box>

      <Container maxW="7xl" px={10} my={6} textAlign="justify">
        <Text fontSize={'2xl'}>
          {t('termsAndConditions.noticeAgreeement.noticeAgreementHeader')}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>
              {t('termsAndConditions.noticeAgreeement.noticeAgreeementBody')}
            </Text>
          </ListItem>
        </UnorderedList>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t('termsAndConditions.privacy.privacyHeader')}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>
              {t('termsAndConditions.privacy.privacyBody1')}
              <Link
                isExternal
                textDecor={'underline'}
                href={t('termsAndConditions.privacy.privacyBody2Link')}
              >
                {t('termsAndConditions.privacy.privacyBody2')}
                <LinkIcon m="2px" />
              </Link>
              {t('termsAndConditions.privacy.privacyBody3')}
              <Link
                isExternal
                textDecor={'underline'}
                href={t('termsAndConditions.privacy.privacy4Link')}
              >
                {t('termsAndConditions.privacy.privacyBody4')}
                <LinkIcon m="2px" />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t(
            'termsAndConditions.accessToInformation.accessToInformationHeader',
          )}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>
              {t(
                'termsAndConditions.accessToInformation.accessToInformationBody1',
              )}
              <Link
                isExternal
                textDecor={'underline'}
                href={t(
                  'termsAndConditions.accessToInformation.accessToInformationLink',
                )}
              >
                {t(
                  'termsAndConditions.accessToInformation.accessToInformationBody2',
                )}
                <LinkIcon m="2px" />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t('termsAndConditions.dataSecurity.dataSecurityHeader')}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>{t('termsAndConditions.dataSecurity.dataSecurityBody')}</Text>
          </ListItem>
        </UnorderedList>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t(
            'termsAndConditions.intellectualProperty.intellectualPropertyHeader',
          )}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody1',
              )}
            </Text>
          </ListItem>
          <ListItem p={2} >
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody2',
              )}
            </Text>
          </ListItem>
          <ListItem p={2} >
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody3',
              )}
              <Link
                isExternal
                textDecor={'underline'}
                href={t(
                  'termsAndConditions.intellectualProperty.intellectualPropertyLink1',
                )}
              >
                {t(
                  'termsAndConditions.intellectualProperty.intellectualPropertyBody4',
                )}
              </Link>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody5',
              )}
              <Link
                isExternal
                textDecor={'underline'}
                href={t(
                  'termsAndConditions.intellectualProperty.intellectualPropertyLink2',
                )}
              >
                {t(
                  'termsAndConditions.intellectualProperty.intellectualPropertyBody6',
                )}
              </Link>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody7',
              )}
            </Text>
          </ListItem>
          <ListItem p={2} >
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody8',
              )}
            </Text>
          </ListItem>
        </UnorderedList>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t('termsAndConditions.dataHandling.dataHandlingHeader')}
        </Text>
        <UnorderedList>
          <ListItem p={2} >
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody1')}
            </Text>
          </ListItem>
          <ListItem p={2} >
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody2')}
            </Text>
          </ListItem>
          <ListItem p={2} >
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody3')}
              <Link
                textDecor={'underline'}
                isExternal
                href={t('termsAndConditions.dataHandling.dataHandlingLink')}
              >
                {t('termsAndConditions.dataHandling.dataHandlingBody4')}
                <LinkIcon />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>
        <Divider m={2} />
        {/* <Divider m={2} />
        <Divider m={2} />
        <Divider m={2} />
        <Divider m={2} />
        <Divider m={2} />
        <Divider m={2} /> */}
        <Text fontSize={'2xl'}>Account</Text>
        <Text>
          You will need a Tracker account to use certain products and services.
          You are responsible for maintaining the confidentiality of your
          account, password and for restricting access to your account. You also
          agree to accept responsibility for all activities that occur under
          your account or password. TBS accepts no liability for any loss or
          damage arising from your failure to maintain the security of your
          account or password.
        </Text>
        <Text>
          You acknowledge that TBS will use the email address you provide as the
          primary method for communication.
        </Text>
        <Text>
          TBS reserves the right to refuse service, and may reject your
          application for an account, or cancel an existing account, for any
          reason, at our sole discretion.
        </Text>
        <Divider m={2} />
        <Text fontSize={'2xl'}>Limitation of Liability</Text>
        <Text>
          The advice, guidance or services provided to you by TBS will be
          provided on an “as-is” basis, without warrantee or representation of
          any kind, and TBS will not be liable for any loss, liability, damage
          or cost, including loss of data or interruptions of business arising
          from the provision of such advice, guidance or services by Tracker.
          Consequently, TBS recommends, that the users exercise their own skill
          and care with respect to their use of the advice, guidance and
          services that Tracker provides.
        </Text>
        <Divider m={2} />
        <Text fontSize={'2xl'}>Terms of Use</Text>
        <Text>
          You agree to use our , products and services only for lawful purposes
          and in a manner that does not infringe the rights of, or restrict or
          inhibit the use and enjoyment of, the , products or services by any
          third party. Additionally, you must not misuse, compromise or
          interfere with our services, or introduce material to our services
          that is malicious or technologically harmful. You must not attempt to
          gain unauthorized access to, tamper with, reverse engineer, or modify
          our , products or services, the server(s) on which they are stored, or
          any server, computer or database connected to our , products or
          services. We may suspend or stop providing our products or services to
          you if you do not comply with our terms or policies or if we are
          investigating suspected misconduct. Any suspected illegal use of our ,
          products or services may be reported to the relevant law enforcement
          authorities and where necessary we will co-operate with those
          authorities by disclosing your identity to them.
        </Text>
        <Text>
          Information on this site, other than protected intellectual property,
          such as copyright and trademarks, and Government of Canada symbols and
          other graphics, has been posted with the intent that it be readily
          available for personal and public non-commercial use and may be
          reproduced, in part or in whole and by any means, without charge or
          further permission from TBS. We ask only that:
          <Text>
            Users exercise due diligence in ensuring the accuracy of the
            materials reproduced;
          </Text>
          <Text>TBS be identified as the source; and</Text>
          <Text>
            The reproduction is not represented as an official version of the
            materials reproduced, nor as having been made, in affiliation with
            or under the direction of TBS.
          </Text>
        </Text>
        <Divider m={2} />
        <Text fontSize={'2xl'}>Notification of Changes</Text>
        <Text>
          We reserve the right to make changes to our layout and content,
          policies, products, services, and these Terms and Conditions at any
          time without notice. Please check these Terms and Conditions
          regularly, as continued use of our services after a change has been
          made will be considered your acceptance of the change.
        </Text>
        <Divider m={2} />
        <Text fontSize={'2xl'}>Termination</Text>
        <Text>
          We reserve the right to modify or terminate our services for any
          reason, without notice, at any time.
        </Text>
        <Text>
          If at any time you or your representatives wish to adjust or cancel
          these services, please contact us at
          <Link
            textDecor={'underline'}
            isExternal
            href="https://https-everywhere.canada.ca/en/help/"
          >
            https://https-everywhere.canada.ca/en/help/
          </Link>
        </Text>

        <Divider m={2} />

        <Text fontSize={'2xl'}>Jurisdiction</Text>
        <Text>
          These terms and conditions shall be governed by and interpreted under
          the laws of Canada, without regard for any choice of law rules. The
          courts of Canada shall have exclusive jurisdiction over all matters
          arising in relation to these terms and conditions.
        </Text>
      </Container>
      <br />
    </>
  )
}
