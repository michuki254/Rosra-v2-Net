using System.Collections.Generic;

namespace RosraApp.Models.ViewModels
{
    public class TabViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVisited { get; set; }
        public string ContentPartialName { get; set; } = string.Empty;
        public int StepNumber { get; set; } = 0; // For stepper display in Bottom-Up tabs
    }

    public class UmbrellaTabViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<TabViewModel> SubTabs { get; set; } = new List<TabViewModel>();
        public bool HasStepper { get; set; } = false; // True for Bottom-Up (multi-step pipeline)
    }

    public class TabsContainerViewModel
    {
        public string ContainerId { get; set; } = string.Empty;
        public List<TabViewModel> Tabs { get; set; } = new List<TabViewModel>(); // Legacy support
        public List<UmbrellaTabViewModel> UmbrellaTabs { get; set; } = new List<UmbrellaTabViewModel>();
        public string ActiveUmbrellaTabId { get; set; } = string.Empty;
        public string ActiveSubTabId { get; set; } = string.Empty;
        public RosraFormViewModel TabContentModel { get; set; } = new RosraFormViewModel();
    }
}
