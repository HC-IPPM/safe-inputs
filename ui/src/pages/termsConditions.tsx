import React from 'react'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  AspectRatio,
  Box,
  Center,
  Container,
  Divider,
  Link,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function TermsConditions() {
  const { t } = useTranslation()

  return (
    <>
      <Box h="2px" bg="rgb(000,000,000,.6)"></Box>      
      <Box w="100%"
      // boxShadow= 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px'
      boxShadow= "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"     
      >
        <AspectRatio h="100px">
          <video id="background-video" loop autoPlay muted   >
            <source
              src="https://geo.ca/wp-content/uploads/videos/cgp_test_vid.mp4#t=1,82"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
        <Box bg="transparent" position={'absolute'} top="75px" w="100%">
          <Center
            alignItems="center"
            justifyContent=" center"
            height="80px"
            w="auto"
            p={6}            
            borderStyle="solid"
            transition="background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s"          
          >
            <Text
              fontSize=" calc(12px + 2vmin)"
              color="#ffffff"
              backdropFilter="blur(20px)"
              px={'15px'}
              borderRadius='10px'
              border='2px transparent'
              fontWeight='bold'
            >
              {t("footer.termsConditions")}
            </Text>
          </Center>
        </Box>
      </Box>

      <Container maxW="7xl" px={10} my={6} textAlign="justify">
         <Text fontSize={'2xl'}>
          {t('termsAndConditions.noticeAgreeement.noticeAgreementHeader')}
        </Text>

        <Text>
          {t('termsAndConditions.noticeAgreeement.noticeAgreeementBody')}
        </Text>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          {t('termsAndConditions.privacy.privacyHeader')}
        </Text>

        <Text>
          {t('termsAndConditions.privacy.privacy1')}
          <Link isExternal href={t('termsAndConditions.privacy.privacy2Link')}>
            {t('termsAndConditions.privacy.privacy2')}
            <ExternalLinkIcon mx="2px" />
          </Link>
          {t('termsAndConditions.privacy.privacy3')}
          <Link isExternal href={t('termsAndConditions.privacy.privacy4Link')}>
            {t('termsAndConditions.privacy.privacy4')}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>

        <Divider m={2} />

        <Text fontSize={'2xl'}>Access to Information</Text>

        <Text>
          Information shared with TBS, or acquired via systems hosted by TBS,
          may be subject to public disclosure under the
          <Link
            isExternal
            href="https://www.canada.ca/en/treasury-board-secretariat/services/access-information-privacy/access-information-act.html"
          >
            Access to Information Act.
          </Link>
        </Text>

        <Divider m={2} />

        <Text fontSize={'2xl'}>Data Security and Use</Text>

        <Text>
          You agree to protect any information disclosed to you by TBS in
          accordance with the data handling measures outlined in these Terms
          &amp; Conditions. Similarly, TBS agrees to protect any information you
          disclose to us. Any such information must only be used for the
          purposes for which it was intended.
        </Text>

        <Divider m={2} />

        <Text fontSize={'2xl'}>
          Intellectual Property, Copyright and Trademarks
        </Text>

        <Text>
          Any products or related services provided to you by TBS are and will
          remain the intellectual property of the Government of Canada.
        </Text>
        <Text>
          The graphics displayed on the Tracker may not be used, in whole or in
          part, in connection with any business, products or service, or
          otherwise used, in a manner that is likely to lead to the belief that
          such business product, service or other use, has received the
          Government of Canada's approval and may not be copied, reproduced,
          imitated, or used, in whole or in part, without the prior written
          permission of tbs.
        </Text>
        <Text>
          The material available on this web site is subject to the
          <Link
            isExternal
            href="https://cb-cda.gc.ca/en/copyright-information/acts-and-regulations"
          >
            Copyright Act
          </Link>
          , and
          <Link
            isExternal
            href="https://laws-lois.justice.gc.ca/eng/acts/t-13/FullText.html"
          >
            Trademarks Act
          </Link>
          and by applicable laws, policies, regulations and international
          agreements.
        </Text>
        <Text>
          Use of intellectual property in breach of this agreement may result in
          the termination of access to the Tracker , product or services.
        </Text>
        <Divider m={2} />
        <Text fontSize={'2xl'}>Data Handling</Text>
        <Text>
          TBS agrees to protect any information you disclose to us in a manner
          commensurate with the level of protection you use to secure such
          information, but in any event, with no less than a reasonable level of
          care.
        </Text>
        <Text>
          You acknowledge that any data or information disclosed to TBS may be
          used to protect the Government of Canada as well as electronic
          information and information infrastructures designated as being of
          importance to the Government of Canada in accordance with cyber
          security and information assurance aspect of TBS's mandate under the
          Policy on Government Security and the Policy on Service and Digital.
        </Text>
        <Text>
          Any data or information disclosed to TBS will be used in a manner
          consistent with our
          <Link
            isExternal
            href="https://publiservice.tbs-sct.gc.ca/tbs-sct/cmn/notices-avis-eng.asp"
          >
            Privacy Notice Statement
          </Link>
        </Text>
        <Divider m={2} />
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
          <Link isExternal href="https://https-everywhere.canada.ca/en/help/">
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
