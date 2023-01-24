import React from 'react'

import { LinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Divider,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function TermsConditions() {
  const { t } = useTranslation()

  function NoticeOfAgreement() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.noticeAgreeement.noticeAgreementHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.noticeAgreeement.noticeAgreeementBody')}
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function Privacy() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.privacy.privacyHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.privacy.privacyBody1')}
              <Link
                isExternal
                textDecor={'underline'}
                href={t('termsAndConditions.privacy.privacyBody2Link')  || '' }
              >
                {t('termsAndConditions.privacy.privacyBody2')}
                <LinkIcon m="2px" />
              </Link>
              {t('termsAndConditions.privacy.privacyBody3')}
              <Link
                isExternal
                textDecor={'underline'}
                href={t('termsAndConditions.privacy.privacy4Link')  || '' }
              >
                {t('termsAndConditions.privacy.privacyBody4')}
                <LinkIcon m="2px" />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function AccessToInformation() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t(
            'termsAndConditions.accessToInformation.accessToInformationHeader',
          )}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.accessToInformation.accessToInformationBody1',
              )}
              <Link
                isExternal
                textDecor={'underline'}
                href={t(
                  'termsAndConditions.accessToInformation.accessToInformationLink',
                )  || '' }
              >
                {t(
                  'termsAndConditions.accessToInformation.accessToInformationBody2',
                )}
                <LinkIcon m="2px" />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function DataSecurityAndUse() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.dataSecurity.dataSecurityHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>{t('termsAndConditions.dataSecurity.dataSecurityBody')}</Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function IntellectualPropertyCopyrightAndTrademark() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t(
            'termsAndConditions.intellectualProperty.intellectualPropertyHeader',
          )}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody1',
              )}
            </Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody2',
              )}
            </Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody3',
              )}
              <Link
                isExternal
                textDecor={'underline'}
                href={t(
                  'termsAndConditions.intellectualProperty.intellectualPropertyLink1',
                ) || '' }
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
                ) || '' }
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
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.intellectualProperty.intellectualPropertyBody8',
              )}
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function DataHandling() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.dataHandling.dataHandlingHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody1')}
            </Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody2')}
            </Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.dataHandling.dataHandlingBody3')}
              <Link
                textDecor={'underline'}
                isExternal
                href={t('termsAndConditions.dataHandling.dataHandlingLink') || '' }
              >
                {t('termsAndConditions.dataHandling.dataHandlingBody4')}
                <LinkIcon />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  // function Account() {
  //   return (
  //     <>
  //       <Text fontSize={'2xl'} pb={2}>
  //         {t('termsAndConditions.account.accountHeader')}
  //       </Text>
  //       <UnorderedList>
  //         <ListItem listStyleType="disc" px={2}>
  //           <Text>{t('termsAndConditions.account.accountBody1')}</Text>
  //         </ListItem>
  //         <ListItem listStyleType="disc" px={2}>
  //           <Text>{t('termsAndConditions.account.accountBody2')}</Text>
  //         </ListItem>
  //         <ListItem listStyleType="disc" px={2}>
  //           <Text>{t('termsAndConditions.account.accountBody3')}</Text>
  //         </ListItem>
  //       </UnorderedList>
  //     </>
  //   )
  // }
  function LimitationOfLiability() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t(
            'termsAndConditions.limitarionOfLiability.limitarionOfLiabilityHeader',
          )}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t(
                'termsAndConditions.limitarionOfLiability.limitarionOfLiabilityBody',
              )}
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function TermsOfUse() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.termsOfUse.termsOfUseHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>{t('termsAndConditions.termsOfUse.termsOfUseBody1')} </Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.termsOfUse.termsOfUseBody2.paragraph')}
            </Text>
            <UnorderedList>
              <ListItem listStyleType="circle" mx={6}>
                <Text>
                  {t('termsAndConditions.termsOfUse.termsOfUseBody2.listItem1')}
                </Text>
              </ListItem>
              <ListItem listStyleType="circle" mx={6}>
                <Text>
                  {t('termsAndConditions.termsOfUse.termsOfUseBody2.listItem2')}
                </Text>
              </ListItem>
              <ListItem listStyleType="circle" mx={6}>
                <Text>
                  {t('termsAndConditions.termsOfUse.termsOfUseBody2.listItem3')}
                </Text>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function NoticeOfChange() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.noticeOfChange.noticeOfChangeHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.noticeOfChange.noticeOfChangeBody')}
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function Termination() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.termination.terminationHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>{t('termsAndConditions.termination.terminationBody1')}</Text>
          </ListItem>
          <ListItem listStyleType="disc" px={2}>
            <Text>
              {t('termsAndConditions.termination.terminationBody2')}
              <br />
              <Link
                isExternal
                textDecor={'underline'}
                href={t('termsAndConditions.termination.terminationBody2Link') || '' }
              >
                {t('termsAndConditions.termination.terminationBody3')}
                <LinkIcon m="2px" />
              </Link>
            </Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }
  function Jurisdiction() {
    return (
      <>
        <Text fontSize={'2xl'} pb={2}>
          {t('termsAndConditions.jurisdiction.jurisdictionHeader')}
        </Text>
        <UnorderedList>
          <ListItem listStyleType="disc" px={2}>
            <Text>{t('termsAndConditions.jurisdiction.jurisdictionBody')}</Text>
          </ListItem>
        </UnorderedList>
      </>
    )
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        {t('footer.termsConditions')}
      </Box>

      <Container maxW="7xl" px={10} my={6} textAlign="justify">
        <NoticeOfAgreement />

        <Divider m={2} />
        <Privacy />

        <Divider m={2} />
        <AccessToInformation />

        <Divider m={2} />
        <DataSecurityAndUse />

        <Divider m={2} />
        <IntellectualPropertyCopyrightAndTrademark />

        <Divider m={2} />
        <DataHandling />

        {/* <Divider m={2} />
        <Account /> */}

        <Divider m={2} />
        <LimitationOfLiability />

        <Divider m={2} />
        <TermsOfUse />

        <Divider m={2} />
        <NoticeOfChange />

        <Divider m={2} />
        <Termination />

        <Divider m={2} />
        <Jurisdiction />
      </Container>
      <br />
    </>
  )
}
