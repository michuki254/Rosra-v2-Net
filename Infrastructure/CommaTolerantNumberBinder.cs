using System.Globalization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace RosraApp.Infrastructure;

// =============================================================================
// CommaTolerantNumberBinder
//
// The ROSRA form pages add JS thousand separators ("12,500") to numeric inputs
// for readability. Default MVC model binding for int / decimal / long types
// uses InvariantCulture parsing, which rejects the comma and silently leaves
// the property at its default. That meant every numeric Gap-Analysis field
// (RegisteredProperties, CompliantBusinesses, OutstandingAmount, …) was
// dropped on save unless the controller hand-rolled a ParseFormInt /
// ParseFormDecimal call for it. Two save endpoints (SaveReport,
// AutoSaveReport) had divergent lists, and several fields lived in neither —
// so they were never persisted at all.
//
// This binder runs before the default SimpleTypeModelBinder. It strips spaces
// and commas from the raw form value, then delegates to the framework parser
// using InvariantCulture. Empty / non-numeric input is treated as "no value"
// so nullable types stay null (matching default MVC behaviour).
// =============================================================================

internal sealed class CommaTolerantNumberBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext == null) throw new ArgumentNullException(nameof(bindingContext));

        var modelName = bindingContext.ModelName;
        var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);
        if (valueProviderResult == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        bindingContext.ModelState.SetModelValue(modelName, valueProviderResult);

        var raw = valueProviderResult.FirstValue;
        if (string.IsNullOrWhiteSpace(raw))
        {
            // Empty input → null for nullable types, 0 for non-nullable (via default).
            // Mark the binding successful so the binder pipeline doesn't fall through.
            if (Nullable.GetUnderlyingType(bindingContext.ModelType) != null)
            {
                bindingContext.Result = ModelBindingResult.Success(null);
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(Activator.CreateInstance(bindingContext.ModelType));
            }
            return Task.CompletedTask;
        }

        // Strip thousand separators (commas) and any whitespace. Keep the decimal
        // point intact — the form uses '.' as the decimal separator.
        var cleaned = raw.Replace(",", string.Empty).Replace(" ", string.Empty);

        var targetType = Nullable.GetUnderlyingType(bindingContext.ModelType) ?? bindingContext.ModelType;
        try
        {
            object? parsed = targetType switch
            {
                Type t when t == typeof(int)     => int.Parse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture),
                Type t when t == typeof(long)    => long.Parse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture),
                Type t when t == typeof(decimal) => decimal.Parse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture),
                Type t when t == typeof(double)  => double.Parse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture),
                Type t when t == typeof(float)   => float.Parse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture),
                _ => null
            };

            if (parsed == null)
            {
                bindingContext.ModelState.TryAddModelError(modelName, $"Unsupported numeric type '{targetType.Name}'");
                bindingContext.Result = ModelBindingResult.Failed();
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(parsed);
            }
        }
        catch (FormatException)
        {
            bindingContext.ModelState.TryAddModelError(modelName, $"The value '{raw}' is not valid.");
            bindingContext.Result = ModelBindingResult.Failed();
        }
        catch (OverflowException)
        {
            bindingContext.ModelState.TryAddModelError(modelName, $"The value '{raw}' is out of range.");
            bindingContext.Result = ModelBindingResult.Failed();
        }

        return Task.CompletedTask;
    }
}

// Provider that selects our binder for numeric types. Must be inserted at
// index 0 so it runs ahead of the framework's SimpleTypeModelBinderProvider.
internal sealed class CommaTolerantNumberBinderProvider : IModelBinderProvider
{
    private static readonly HashSet<Type> Supported = new()
    {
        typeof(int), typeof(int?),
        typeof(long), typeof(long?),
        typeof(decimal), typeof(decimal?),
        typeof(double), typeof(double?),
        typeof(float), typeof(float?)
    };

    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context == null) throw new ArgumentNullException(nameof(context));
        return Supported.Contains(context.Metadata.ModelType)
            ? new CommaTolerantNumberBinder()
            : null;
    }
}
