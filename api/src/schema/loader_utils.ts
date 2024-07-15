import DataLoader from 'dataloader';
import _ from 'lodash';
import type { Model, Document, FilterQuery } from 'mongoose';

export function create_dataloader_for_resources_by_foreign_key_attr<
  ModelDoc extends Document,
>(
  model: Model<ModelDoc>,
  fk_attr: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, { [foreign_key: string]: ModelDoc[] }>(
    async function (fk_ids) {
      const rows = await model.find({
        [fk_attr]: { $in: _.uniq(fk_ids) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const keys_in_fk_attr = fk_attr.split('.');

      // we need to return matched rows from this loader grouped and ordered by the ids that were matched on
      // BUT the target foreign key attr may be a path to a subdocument's foreign key (so we need depth in our group by), and
      // any of those subdocuments may have been arrays of subdocuments which may have been matched on by more
      // than one of the ids we were looking for (so we need completeness in our final grouping)...
      // hence the following
      const get_rows_that_matched_on_id = (id: string) =>
        _.filter(rows, (row) =>
          _.chain(keys_in_fk_attr)
            .reduce((documents, attr) => {
              if (typeof documents.toObject === 'function') {
                return _.flatMap(
                  documents.toObject(),
                  (document: any) => document[attr],
                );
              } else if (_.isArray(documents)) {
                return _.flatMap(documents, (document) => document[attr]);
              } else {
                return _.get(documents, attr);
              }
            }, row)
            .includes(id)
            .value(),
        );

      const groups_of_all_matches_by_id = _.chain(fk_ids)
        .map((id) => [id, get_rows_that_matched_on_id(id)])
        .fromPairs()
        .mapValues((matched_rows) =>
          _.isEmpty(matched_rows) ? null : matched_rows,
        )
        .value();

      const groups_in_order_of_requested_keys = _.map(
        fk_ids,
        (id) => groups_of_all_matches_by_id[id],
      );

      return groups_in_order_of_requested_keys;
    },
    { cache: options.cache },
  );
}

export function create_dataloader_for_resource_by_primary_key_attr<
  ModelDoc extends Document,
>(
  model: Model<ModelDoc>,
  primary_key_attr: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, ModelDoc>(
    async function (keys) {
      const docs = await model.find({
        [primary_key_attr]: { $in: _.uniq(keys) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const docs_by_primary_key = _.keyBy(docs, primary_key_attr);

      const docs_in_order_of_requested_keys = _.map(
        keys,
        (key) => docs_by_primary_key[key],
      );

      return docs_in_order_of_requested_keys;
    },
    { cache: options.cache },
  );
}
