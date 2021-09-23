import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  CONFIRM_RECYCLE_BUTTON_ID,
  ITEM_DELETE_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const recycleItem = (id) => {
  cy.wait(TABLE_ITEM_RENDER_TIME);
  cy.get(`#${buildItemsTableRowId(id)} .${ITEM_DELETE_BUTTON_CLASS}`).click();
  cy.get(`#${CONFIRM_RECYCLE_BUTTON_ID}`).click();
};

describe('Recycle Item in List', () => {
  it('recycle item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    const { id } = SAMPLE_ITEMS.items[0];

    // delete
    recycleItem(id);
    cy.wait('@recycleItem').then(({ request: { url } }) => {
      expect(url).to.contain(id);
    });
    cy.wait('@getOwnItems');
  });

  it('recycle item inside parent', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];
    const { id: idToDelete } = SAMPLE_ITEMS.items[2];

    // go to children item
    cy.visit(buildItemPath(id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    recycleItem(idToDelete);
    cy.wait('@recycleItem').then(({ request: { url } }) => {
      expect(url).to.contain(idToDelete);
    });
  });

  describe('Error handling', () => {
    it('error while recycling item does not recycle in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, recycleItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];
      const { id: idToDelete } = SAMPLE_ITEMS.items[2];

      // go to children item
      cy.visit(buildItemPath(id));

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // delete
      recycleItem(idToDelete);

      cy.wait('@recycleItem').then(() => {
        // check item is still displayed
        cy.get(`#${buildItemsTableRowId(idToDelete)}`).should('exist');
      });
    });
  });
});