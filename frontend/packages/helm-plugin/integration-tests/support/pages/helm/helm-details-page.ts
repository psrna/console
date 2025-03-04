import { modal } from '@console/cypress-integration-tests/views/modal';
import { helmActions } from '@console/dev-console/integration-tests/support/constants';
import { helmPO } from '@console/dev-console/integration-tests/support/pageObjects';

const actions = [helmActions.upgrade, helmActions.rollback, helmActions.uninstallHelmRelease];

export const helmDetailsPage = {
  verifyTitle: () => cy.byTestSectionHeading('Helm Release details').should('be.visible'),
  verifyResourcesTab: () => cy.get(helmPO.resourcesTab).should('be.visible'),
  verifyReleaseNotesTab: () => cy.get(helmPO.revisionHistoryTab).should('be.visible'),
  verifyActionsDropdown: () => cy.byLegacyTestID('actions-menu-button').should('be.visible'),
  verifyRevisionHistoryTab: () => cy.get(helmPO.revisionHistoryTab).should('be.visible'),
  clickActionMenu: () => cy.byLegacyTestID('actions-menu-button').click(),
  verifyActionsInActionMenu: () => {
    cy.byLegacyTestID('action-items')
      .find('li')
      .each(($ele) => {
        expect(actions).toContain($ele.text());
      });
  },
  verifyFieldValue: (fieldName: string, fieldValue: string) => {
    cy.get('dl.co-m-pane__details dt')
      .contains(fieldName)
      .next('dd')
      .should('contain.text', fieldValue);
  },
  uninstallHelmRelease: () => {
    modal.modalTitleShouldContain('Uninstall Helm Release?');
    modal.submit();
    modal.shouldBeClosed();
  },
  enterReleaseNameInUninstallPopup: (releaseName: string = 'nodejs-ex-k') => {
    modal.modalTitleShouldContain('Uninstall Helm Release?');
    cy.get('form strong').should('have.text', releaseName);
    cy.get(helmPO.uninstallHelmRelease.releaseName).type(releaseName);
  },
};
