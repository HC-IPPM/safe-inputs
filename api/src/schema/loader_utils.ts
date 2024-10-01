import DataLoader from 'dataloader';
import _ from 'lodash';
import type { Model, HydratedDocument, FilterQuery } from 'mongoose';

const get_paths_to_populate = <ModelDoc>(model: Model<ModelDoc>) =>
  _.filter(
    _.keys(model.schema.paths),
    (key) => 'ref' in model.schema.path(key),
  );

export function create_dataloader_for_resources_by_foreign_key_attr<ModelDoc>(
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
  return new DataLoader<string, HydratedDocument<ModelDoc>[]>(
    async function (fkey_values) {
      const paths_to_populate = get_paths_to_populate(model);

      const query = () =>
        model.find({
          [fk_attr]: { $in: _.uniq(fkey_values) },
          ...options.constraints,
        } as FilterQuery<ModelDoc>);

      const docs = await (paths_to_populate.length === 0
        ? query()
        : query().populate(paths_to_populate));

      const keys_in_fk_attr = fk_attr.split('.');

      // we need to return matched rows from this loader ordered and grouped by the ids that were matched on
      // BUT the target foreign key attr may be a path to a subdocument's foreign key (so we need depth in our group by), and
      // any of those subdocs may have been arrays of subdocs which may have been matched on by more
      // than one of the ids we were looking for (so we need completeness in our final grouping)...
      // hence the following
      const get_docs_that_matched_on_fkey_value = (fkey_value: string) =>
        _.filter(docs, (root_document) => {
          const fk_attr_leaf_value = _.reduce<string, any>(
            keys_in_fk_attr,
            (docs, key) => _.chain(docs).flatMap(key).filter().value(),
            [root_document],
          );
          return _.some(
            fk_attr_leaf_value,
            (leaf_id) => leaf_id.toString() === fkey_value,
          );
        });

      const groups_in_order_of_requested_fkey_values = _.map(
        fkey_values,
        get_docs_that_matched_on_fkey_value,
      );

      return groups_in_order_of_requested_fkey_values;
    },
    { cache: options.cache || false },
  );
}

export function create_dataloader_for_resource_by_primary_key_attr<ModelDoc>(
  model: Model<ModelDoc>,
  primary_key_attr: keyof ModelDoc | '_id',
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, HydratedDocument<ModelDoc> | undefined>(
    async function (pkey_values) {
      const paths_to_populate = get_paths_to_populate(model);

      const query = () =>
        model.find({
          [primary_key_attr]: { $in: _.uniq(pkey_values) },
          ...options.constraints,
        } as FilterQuery<ModelDoc>);

      const docs = await (paths_to_populate.length === 0
        ? query()
        : query().populate(paths_to_populate));

      const docs_by_primary_key = _.keyBy(docs, (doc) =>
        _.toString(doc[primary_key_attr]),
      );

      const docs_in_order_of_requested_pkey_values = _.map(
        pkey_values,
        (key) => docs_by_primary_key[key],
      );

      return docs_in_order_of_requested_pkey_values;
    },
    { cache: options.cache || false },
  );
}
