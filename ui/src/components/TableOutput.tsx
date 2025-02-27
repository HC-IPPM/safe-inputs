import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';
import { Trans } from '@lingui/react/macro';

import { FcMinus, FcPlus } from 'react-icons/fc';

import type { FullProperties, WorkBook } from 'xlsx';

interface ParserData {
  sheets: object | null;
  workbook: WorkBook;
}

const dateToStr = (d: Date | undefined) => {
  if (!d) return 'N/A';
  return `${d.toLocaleDateString(navigator.language)} - ${d.toLocaleTimeString(
    navigator.language,
  )}`;
};

const getColVal = (properties: FullProperties, prop: keyof FullProperties) => {
  const d = properties[prop];
  if (prop === 'LastPrinted' && d && typeof d === 'string')
    return dateToStr(new Date(d));
  if (prop === 'CreatedDate' || prop === 'ModifiedDate')
    return dateToStr(properties[prop]);
  return properties[prop] || 'N/A';
};

const col = (
  properties: FullProperties,
  prop: keyof FullProperties,
  title?: string,
) => {
  const v = getColVal(properties, prop);
  return (
    <>
      <Th>{title || prop}</Th>
      <Td>{v}</Td>
    </>
  );
};

const TableOutput = ({
  shouldDisplayComponent,
  parserData,
}: {
  shouldDisplayComponent: boolean;
  parserData: ParserData | null;
}): JSX.Element => {
  const p =
    (parserData && parserData.workbook && parserData.workbook.Props) ||
    undefined;
  return (
    <>
      {shouldDisplayComponent && p && (
        <Accordion
          allowToggle
          defaultIndex={[0]}
          fontFamily="Noto Sans"
          fontSize={'16'}
          color="#333"
        >
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  {isExpanded ? (
                    <>
                      <Box flex="1" textAlign="left">
                        <Trans>Show Less</Trans>
                      </Box>{' '}
                      <FcMinus fontSize="12px" />
                    </>
                  ) : (
                    <>
                      <Box flex="1" textAlign="left">
                        <Trans>Show More</Trans>
                      </Box>{' '}
                      <FcPlus fontSize="12px" />
                    </>
                  )}
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <TableContainer>
                    <Table variant="simple">
                      <TableCaption>
                        <Trans>File Properties</Trans>
                      </TableCaption>
                      <Tbody>
                        <Tr>
                          {col(p, 'Application')}
                          {col(p, 'SheetNames')}
                        </Tr>
                        <Tr>
                          {col(p, 'AppVersion')}
                          {col(p, 'ContentStatus')}
                        </Tr>
                        <Tr>
                          {col(p, 'Title')}
                          {col(p, 'Subject')}
                        </Tr>
                        <Tr>
                          {col(p, 'Author')}
                          {col(p, 'Manager')}
                        </Tr>
                        <Tr>
                          {col(p, 'Company')}
                          {col(p, 'Category')}
                        </Tr>
                        <Tr>
                          {col(p, 'Keywords')}
                          {col(p, 'Comments')}
                        </Tr>
                        <Tr>
                          {col(p, 'LastAuthor')}
                          {col(p, 'CreatedDate')}
                        </Tr>
                        <Tr>
                          {col(p, 'DocSecurity')}
                          {col(p, 'Identifier')}
                        </Tr>
                        <Tr>
                          {col(p, 'SharedDoc')}
                          {col(p, 'Language')}
                        </Tr>
                        <Tr>
                          {col(p, 'HyperlinksChanged')}
                          {col(p, 'Version')}
                        </Tr>
                        <Tr>
                          {col(p, 'LinksUpToDate')}
                          {col(p, 'Revision')}
                        </Tr>
                        <Tr>
                          {col(p, 'ScaleCrop')}
                          {col(p, 'LastPrinted')}
                        </Tr>
                        <Tr>
                          {col(p, 'Worksheets')}
                          {col(p, 'ModifiedDate')}
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </AccordionPanel>
                <Box>
                  <Trans>Data Preview</Trans>
                  <Box
                    h="600px"
                    overflowY={'auto'}
                    overflow="wrap"
                    bg="#eee"
                    border="1px dotted #284162"
                    padding="5px"
                    text-align="left"
                  >
                    <pre>{JSON.stringify(parserData?.sheets, null, 2)}</pre>
                  </Box>
                </Box>
              </>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
};

export default TableOutput;
